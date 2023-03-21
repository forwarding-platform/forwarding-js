// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { supabaseAdmin } from "@/libs/adminSupabase";
import { userData } from "@/utils/seeds/user";

export default async function handler(req, res) {
  const tasks = [];
  userData.forEach((user) => {
    const signupTask = supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        introduction: user?.introduction,
        interest: user.interest ? user?.interest.split(", ") : null,
        birthday: new Date(user?.birthday),
        work: user.work ? user?.work.split(", ") : null,
        country: user?.country,
      },
    });
    tasks.push(signupTask);
  });
  Promise.all(tasks).then((tasks) => {
    res.send(
      JSON.stringify(
        tasks.map((t) => t.data),
        null,
        2
      )
    );
  });
}
