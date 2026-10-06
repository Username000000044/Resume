import { TRPCError } from "@trpc/server";
import { db } from "../../drizzle";
import { publicProcedure, router } from "../trpc";
import z from "zod";

export const exportRouter = router({
    exportAsJPG: publicProcedure.query(async (opts) => {
        // puppeteer
        return null;
    }),
    exportAsPNG: publicProcedure.query(async (opts) => {
        // puppeteer
        return null;
    }),
    exportAsPDFStandard: publicProcedure.query(async (opts) => {
        // @react-pdf/renderer
        return null;
    }),
    // exportAsPDFPrint: publicProcedure.query(async (opts) => {
    //     return null;
    // }),
    exportAsDOCX: publicProcedure.query(async (opts) => {
        // docx
        return null;
    }),
});