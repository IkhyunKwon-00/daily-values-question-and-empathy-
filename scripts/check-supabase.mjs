// One-off integration check against the live Supabase project.
import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const base = { apikey: KEY, "Content-Type": "application/json" };

const email = `qa.${Date.now()}@dvqe-demo.co`;
const password = "test1234!";

async function main() {
  // 1) signup
  const signup = await fetch(`${URL_}/auth/v1/signup`, {
    method: "POST",
    headers: base,
    body: JSON.stringify({ email, password, data: { gender: "female" } }),
  });
  const su = await signup.json();
  console.log("SIGNUP http", signup.status);
  console.log("  has session:", !!su.access_token);
  console.log("  user id:", su.user?.id || su.id || "(none)");
  if (su.error_code || su.msg)
    console.log("  err:", su.error_code, su.msg);

  let token = su.access_token;

  // 2) if no session (email confirm on), try password grant anyway
  if (!token) {
    const login = await fetch(`${URL_}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: base,
      body: JSON.stringify({ email, password }),
    });
    const lo = await login.json();
    console.log("LOGIN http", login.status, lo.error_code || "");
    token = lo.access_token;
  }

  if (!token) {
    console.log("\n=> No session available (email confirmation likely ON).");
    return;
  }

  const auth = {
    apikey: KEY,
    Authorization: `Bearer ${token}`,
  };

  // 3) today's question (needs authenticated role per RLS)
  const today = new Date().toISOString().slice(0, 10);
  const q = await fetch(
    `${URL_}/rest/v1/questions?select=text,category,publish_date&publish_date=eq.${today}`,
    { headers: auth }
  );
  const qs = await q.json();
  console.log("\nTODAY QUESTION http", q.status);
  console.log("  ", JSON.stringify(qs));

  // 4) total questions count (seed check)
  const cnt = await fetch(`${URL_}/rest/v1/questions?select=id`, {
    headers: { ...auth, Prefer: "count=exact" },
  });
  console.log("QUESTIONS count header:", cnt.headers.get("content-range"));

  // 5) profile row created by trigger?
  const prof = await fetch(`${URL_}/rest/v1/profiles?select=id,gender`, {
    headers: auth,
  });
  const pr = await prof.json();
  console.log("PROFILES (visible) http", prof.status, JSON.stringify(pr));
}

main().catch((e) => console.error("FATAL", e));
