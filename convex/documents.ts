import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

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