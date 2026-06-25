import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Webhook received");
    try {
        const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!signingSecret) {
        console.log("Missing signing secret");
        res.status(500).json({ error: "Webhook signing secret is not provided" });
        return;
    }

    //clerk's verifier expects a web request with the raw body, express.raw gives a Buffer.
    const payload = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body);
    const request = new Request("http://internal/webhooks/clerk", {
        method: "POST",
        headers: new Headers(req.headers),
        body: payload,
    });

    //throws if the signature is wrong or the bidy was tampered with; only then do we trust evt.
    const evt = await verifyWebhook(request, { signingSecret });
    console.log("Webhook verified", evt.type);

    if (evt.type === "user.created" || evt.type === "user.updated"){
        const u = evt.data;

        console.log("Clerk user id:", u.id);

        const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
        u.email_addresses?.[0]?.email_address;

        
        const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email?.split("@")
        [0];

        console.log({
                email,
                fullName,
                image: u.image_url,
            });
        
        const user = await User.findOneAndUpdate( 
            { clerkId: u.id },
            { clerkId: u.id, email, fullName, profilePic: u.image_url },
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        );
          console.log("MongoDB user saved:", user);
    }

    if(evt.type === "user.deleted"){
        console.log("Deleting user:", evt.data.id);
        if(evt.data.id) await User.findOneAndDelete({ clerkId: evt.data.id });
         console.log("User deleted");
    }

    res.status(200).json({ received: true});

    } catch (error) {
        console.error ("Error in Clerk webhook:", error);
        res.status(400).json({ message: "Webhook verification failed" });

    }
});

export default router;