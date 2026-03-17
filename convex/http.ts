import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/sendOtp",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { phone, type } = body as { phone: string; type?: "login" | "verify_phone" };

      if (!phone) {
        return new Response(JSON.stringify({ error: "Phone number is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runMutation(api.auth.sendOtp, {
        phone,
        type: type || "login"
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("sendOtp error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to send OTP" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/verifyOtp",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { phone, otp } = body as { phone: string; otp: string };

      if (!phone || !otp) {
        return new Response(JSON.stringify({ error: "Phone and OTP are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runMutation(api.auth.verifyOtp, { phone, otp });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("verifyOtp error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to verify OTP" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/login",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { phone, otp } = body as { phone: string; otp: string };

      if (!phone || !otp) {
        return new Response(JSON.stringify({ error: "Phone and OTP are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runMutation(api.auth.login, { phone, otp });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("login error:", error);
      return new Response(JSON.stringify({ error: error.message || "Login failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/register",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { fullName, phone, city, role } = body as {
        fullName: string;
        phone: string;
        city: string;
        role?: string;
      };

      if (!fullName || !phone) {
        return new Response(JSON.stringify({ error: "Full name and phone are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runMutation(api.auth.register, {
        fullName,
        phone,
        city: city || "",
        role
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("register error:", error);
      return new Response(JSON.stringify({ error: error.message || "Registration failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getCurrentUser",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token } = body as { token?: string };

      const result = await ctx.runQuery(api.auth.getCurrentUser, { token });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getCurrentUser error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get user" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getMuzakkis",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, relawanId } = body as { token?: string; relawanId?: string };

      if (!relawanId) {
        return new Response(JSON.stringify({ error: "relawanId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.muzakkis.listByRelawan, {
        token,
        relawanId: relawanId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getMuzakkis error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get muzakkis" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getDonations",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, relawanId } = body as { token?: string; relawanId?: string };

      if (!relawanId) {
        return new Response(JSON.stringify({ error: "relawanId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.donations.listByRelawan, {
        token,
        relawanId: relawanId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getDonations error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get donations" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getStatistics",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, relawanId } = body as { token?: string; relawanId?: string };

      if (!relawanId) {
        return new Response(JSON.stringify({ error: "relawanId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.statistics.getRelawanStatistics, {
        token,
        relawanId: relawanId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getStatistics error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get statistics" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getPrograms",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token } = body as { token?: string };

      const result = await ctx.runQuery(api.programs.list, { token });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getPrograms error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get programs" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getRegus",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token } = body as { token?: string };

      const result = await ctx.runQuery(api.regus.list, { token });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getRegus error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get regus" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== MUZAKKI ENDPOINTS ====================

http.route({
  path: "/getMuzakki",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, muzakkiId } = body as { token?: string; muzakkiId?: string };

      if (!muzakkiId) {
        return new Response(JSON.stringify({ error: "muzakkiId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.muzakkis.get, {
        token,
        id: muzakkiId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getMuzakki error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get muzakki" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/addMuzakki",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, name, phone, city, category, status, notes } = body as {
        token?: string;
        name: string;
        phone: string;
        city?: string;
        category?: string;
        status: string;
        notes?: string;
      };

      const result = await ctx.runMutation(api.muzakkis.create, {
        token,
        name,
        phone,
        city,
        category: category as any,
        status: status as any,
        notes,
      });

      return new Response(JSON.stringify({ success: true, id: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("addMuzakki error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to add muzakki" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/updateMuzakki",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, muzakkiId, relawanId, name, phone, city, status, notes } = body as {
        token?: string;
        muzakkiId: string;
        relawanId: string;
        name?: string;
        phone?: string;
        city?: string;
        status?: string;
        notes?: string;
      };

      const result = await ctx.runMutation(api.muzakkis.update, {
        token,
        id: muzakkiId as any,
        relawan_id: relawanId as any,
        name,
        phone,
        city,
        status: status as any,
        notes,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("updateMuzakki error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to update muzakki" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/deleteMuzakki",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, muzakkiId } = body as { token?: string; muzakkiId: string };

      const result = await ctx.runMutation(api.muzakkis.deleteMuzakki, {
        token,
        id: muzakkiId as any,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("deleteMuzakki error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to delete muzakki" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getCommunications",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, muzakkiId } = body as { token?: string; muzakkiId?: string };

      if (!muzakkiId) {
        return new Response(JSON.stringify({ error: "muzakkiId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.muzakkis.listCommunications, {
        token,
        muzakkiId: muzakkiId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getCommunications error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get communications" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/addCommunication",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, muzakki_id, relawan_id, type, notes } = body as {
        token?: string;
        muzakki_id: string;
        relawan_id: string;
        type: string;
        notes: string;
      };

      const result = await ctx.runMutation(api.muzakkis.addCommunication, {
        token,
        muzakki_id: muzakki_id as any,
        relawan_id: relawan_id as any,
        type: type as any,
        notes,
      });

      return new Response(JSON.stringify({ success: true, id: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("addCommunication error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to add communication" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== REGU ENDPOINTS ====================

http.route({
  path: "/getRegu",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, reguId } = body as { token?: string; reguId?: string };

      if (!reguId) {
        return new Response(JSON.stringify({ error: "reguId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.regus.get, {
        token,
        id: reguId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getRegu error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get regu" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getReguByCode",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, code } = body as { token?: string; code: string };

      const result = await ctx.runQuery(api.regus.getByCode, {
        token,
        code
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getReguByCode error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get regu by code" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getReguMembers",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, reguId } = body as { token?: string; reguId?: string };

      if (!reguId) {
        return new Response(JSON.stringify({ error: "reguId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.regus.getMembers, {
        token,
        reguId: reguId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getReguMembers error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get regu members" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/createRegu",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, name, pembimbing_id, description, target_amount } = body as {
        token?: string;
        name: string;
        pembimbing_id: string;
        description?: string;
        target_amount?: number;
      };

      const result = await ctx.runMutation(api.regus.create, {
        token,
        name,
        pembimbing_id: pembimbing_id as any,
        description,
        target_amount,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("createRegu error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to create regu" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/joinRegu",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, reguId, userId } = body as {
        token?: string;
        reguId: string;
        userId: string;
      };

      const result = await ctx.runMutation(api.regus.addMember, {
        token,
        reguId: reguId as any,
        userId: userId as any,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("joinRegu error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to join regu" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== PROGRAM ENDPOINTS ====================

http.route({
  path: "/getProgram",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, programId } = body as { token?: string; programId?: string };

      if (!programId) {
        return new Response(JSON.stringify({ error: "programId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.programs.get, {
        token,
        id: programId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getProgram error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get program" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== DONATION ENDPOINTS ====================

http.route({
  path: "/addDonation",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { 
        token, amount, category, donor_name, donor_id, relawan_id, 
        relawan_name, event_name, type, notes, bukti_transfer_url, 
        payment_method, receipt_number 
      } = body as {
        token?: string;
        amount: number;
        category: string;
        donor_name: string;
        donor_id?: string;
        relawan_id: string;
        relawan_name?: string;
        event_name?: string;
        type: string;
        notes?: string;
        bukti_transfer_url?: string | null;
        payment_method?: string;
        receipt_number?: string;
      };

      const result = await ctx.runMutation(api.donations.create, {
        token,
        amount,
        category: category as any,
        donor_name,
        donor_id: donor_id as any,
        relawan_id: relawan_id as any,
        relawan_name,
        event_name,
        type: type as any,
        notes,
        bukti_transfer_url: bukti_transfer_url || null,
        payment_method,
        receipt_number,
      });

      return new Response(JSON.stringify({ success: true, id: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("addDonation error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to add donation" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/getMuzakkiDonations",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, muzakkiId } = body as { token?: string; muzakkiId?: string };

      if (!muzakkiId) {
        return new Response(JSON.stringify({ error: "muzakkiId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.donations.listByMuzakki, {
        token,
        muzakkiId: muzakkiId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getMuzakkiDonations error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get muzakki donations" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== CHAT ENDPOINTS ====================

http.route({
  path: "/getChatMessages",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, reguId } = body as { token?: string; reguId?: string };

      if (!reguId) {
        return new Response(JSON.stringify({ error: "reguId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.chat.list, {
        token,
        reguId
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getChatMessages error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get chat messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/sendChatMessage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, regu_id, sender_id, sender_name, message } = body as {
        token?: string;
        regu_id: string;
        sender_id: string;
        sender_name: string;
        message: string;
      };

      const result = await ctx.runMutation(api.chat.send, {
        token,
        regu_id,
        sender_id,
        sender_name,
        message,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("sendChatMessage error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to send chat message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== NOTIFICATION ENDPOINTS ====================

http.route({
  path: "/getNotifications",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, userId } = body as { token?: string; userId?: string };

      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.notifications.getByUser, {
        token,
        userId: userId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getNotifications error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get notifications" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

http.route({
  path: "/markNotificationRead",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, notificationId } = body as { token?: string; notificationId: string };

      const result = await ctx.runMutation(api.notifications.markAsRead, {
        token,
        id: notificationId as any,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("markNotificationRead error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to mark notification as read" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== TEMPLATE ENDPOINTS ====================

http.route({
  path: "/getTemplates",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, all, relawanId } = body as { 
        token?: string; 
        all?: boolean;
        relawanId?: string;
      };

      const result = await ctx.runQuery(api.templates.list, {
        token,
        all,
        relawanId,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getTemplates error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get templates" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== MY REGUS ENDPOINT ====================

http.route({
  path: "/getMyRegus",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, userId } = body as { token?: string; userId?: string };

      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.regus.getByMember, {
        token,
        userId: userId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getMyRegus error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get my regus" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== PEMBIMBING REGUS ENDPOINT ====================

http.route({
  path: "/getPembimbingRegus",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, pembimbingId } = body as { token?: string; pembimbingId?: string };

      if (!pembimbingId) {
        return new Response(JSON.stringify({ error: "pembimbingId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.regus.getByPembimbing, {
        token,
        pembimbingId: pembimbingId as any
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getPembimbingRegus error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get pembimbing regus" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== ACTIVITIES ENDPOINT ====================

http.route({
  path: "/getActivities",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { token, userId } = body as { 
        token?: string; 
        userId?: string;
      };

      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const result = await ctx.runQuery(api.statistics.getRelawanStatistics, {
        token,
        relawanId: userId as any
      });

      return new Response(JSON.stringify(result.recent_activities || []), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error: any) {
      console.error("getActivities error:", error);
      return new Response(JSON.stringify({ error: error.message || "Failed to get activities" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

// ==================== HEALTH CHECK ====================

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async (_ctx, _request) => {
    return new Response(JSON.stringify({
      status: "ok",
      timestamp: Date.now(),
      backend: "convex"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }),
});

export default http;
