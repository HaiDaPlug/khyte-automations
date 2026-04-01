"use client";

import Container from "@/components/Container";
import Statement from "@/components/sections/Statement";
import { HeroStatementTransition } from "@/components/HeroStatementTransition";

export default function StatementZone() {
  return (
    <>
      <HeroStatementTransition />
      <Container>
        <Statement />
      </Container>
    </>
  );
}
