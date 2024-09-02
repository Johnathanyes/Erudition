import { action, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api" 

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
            throw new ConvexError("Not Authenticated")
        }

        await ctx.db.insert("documents", {
            title: args.title,
            tokenIdentifier: userId,
            fileId: args.fileId,
        })
    }
})

export const getDocuments = query({
    handler: async (ctx) => {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return []
        }

        return await ctx.db.query("documents").withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId)).collect()
    }
})

export const getDocument = query({
    args: {
        documentId: v.id("documents"),
    },
    handler: async (ctx, args) => {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return null
        }

        const document = await ctx.db.get(args.documentId)

        if (document?.tokenIdentifier !== userId) {
            return null
        }

        if (!document) {
            return null
        }
        return {...document, documentUrl: await ctx.storage.getUrl(document.fileId)}
    }
})

export const askQuestion = action({
    args: {
        question: v.string(),
        documentId: v.id("documents"),
    },
    handler: async (ctx, args) => {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            throw new ConvexError("Not Authenticated")
        }

        const document = await ctx.runQuery(api.documents.getDocument, {
            documentId: args.documentId,
        })

        if (!document) {
            throw new ConvexError("Document not found")
        }

        const file = await ctx.storage.get(document.fileId);

        if (!file) {
            throw new ConvexError("File not found")
        }

        const text = await file.text();
        
        const chatCompletion: OpenAI.Chat.Completions.ChatCompletion = await client.chat.completions.create({
            messages: [{ role: 'system', content: `here is a text file: ${text}`}, {role: "user", content: `please answer this question: ${args.question}`}],
            model: 'gpt-3.5-turbo',
        });
        
        return chatCompletion.choices[0].message.content;

    }
})