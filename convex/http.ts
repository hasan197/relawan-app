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

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
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
