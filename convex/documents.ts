import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";

import OpenAI from "openai";
import { Id } from "./_generated/dataModel";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const hasAccessToDocument = async (
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">
) => {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  if (!userId) {
    throw new ConvexError("Must be logged in");
  }
  const document = await ctx.db.get(documentId);

  if (!document) {
    throw new ConvexError("No document found");
  }

  if (document.tokenIdentifier !== userId) {
    throw new ConvexError("Trying to access document that does not belong to user");
  }

  return { document, userId };
};

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("Not Authenticated");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      tokenIdentifier: userId,
      fileId: args.fileId,
      description: "", 
    });

    await ctx.scheduler.runAfter(
      0,
      internal.documents.generateDocumentDescription,
      {
        fileId: args.fileId,
        documentId,
      }
    );
  },
});

export const getDocuments = query({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .collect();
  },
});

export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const accesObject = await hasAccessToDocument(ctx, args.documentId);

    if (!accesObject) {
      throw new ConvexError("Could not get document")
    }

    return {
      ...accesObject.document,
      documentUrl: await ctx.storage.getUrl(accesObject.document.fileId),
    };
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const accesObject = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      }
    );

    if (!accesObject) {
      throw new ConvexError("You do not have access to this document");
    }

    const file = await ctx.storage.get(accesObject.document.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const text = await file.text();

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await client.chat.completions.create({
        messages: [
          { role: "system", content: `here is a text file: ${text}` },
          {
            role: "user",
            content: `Answer this question: ${args.question}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: accesObject.userId,
    });

    const response =
      chatCompletion.choices[0].message.content ??
      "Could not generate a response";

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: response,
      isHuman: false,
      tokenIdentifier: accesObject.userId,
    });
  },
});

export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id("documents"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      description: args.description,
    });
  },
});

export const generateDocumentDescription = internalAction({
  args: {
    fileId: v.id("_storage"),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.storage.get(args.fileId);

    if (!file) {
      return new ConvexError("File not found");
    }
    const text = await file.text();

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await client.chat.completions.create({
        messages: [
          { role: "system", content: `here is a text file: ${text}` },
          {
            role: "user",
            content: `Generate a 1 sentence description for this documen`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

    const response =
      chatCompletion.choices[0].message.content ??
      "Could not generate a description";

    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      description: response,
    });
  },
});
