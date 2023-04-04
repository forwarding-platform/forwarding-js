import { Anchor, Center, Loader, Table } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

export default function ChallengeLeaderboard({ challengeId }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { data, isLoading, error } = useSWR(
    user ? `leaderboard-challenge-${challengeId}` : null,
    async () => {
      const { data, error } = await supabase
        .from("practice_challenge_record")
        .select("*, profile(email,username)")
        .eq("practice_challenge_id", challengeId)
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
  if (data.length == 0) return <Center>No records yet</Center>;
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
            <td>{d.time.toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
