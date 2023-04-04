import { Anchor, Center, Loader, Table } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

export default function QuizLeaderboard({ quizId }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { data, isLoading, error } = useSWR(
    user ? `leaderboard-quiz` : null,
    async () => {
      const { data, error } = await supabase
        .from("quiz_record")
        .select("*, profile(email,username)")
        .eq("quiz_id", quizId)
        .order("score", { ascending: false })
        .order("time")
        .limit(10);
      if (error) {
        console.log(error);
        throw new Error();
      }
      if (data) return data;
    }
  );
  if (isLoading)
    return (
      <Center>
        <Loader />
      </Center>
    );
  if (error)
    return <Center>An error occurs when generating leaderboard</Center>;
  return (
    <Table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Email</th>
          <th>Score</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <Anchor
                component={Link}
                href={`/user/${d.profile.username}`}
                onClick={() => modals.closeAll()}
              >
                {d.profile.email}
              </Anchor>
            </td>
            <td>{d.score}</td>
            <td>{new Date(d.time * 1000).toISOString().slice(11, 19)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
