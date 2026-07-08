import {
  Html, Head, Body, Container, Section, Heading, Text, Hr, Link,
} from "@react-email/components";
import type { Man, Woman } from "@/lib/types";

const paper = "#F4EDE1";
const card = "#FBF7EF";
const ink = "#24201B";
const soft = "#5C5347";
const faint = "#9C907D";
const wine = "#7A2E33";
const serif = "Georgia, 'Times New Roman', serif";

export function Drop({ woman, men }: { woman: Woman; men: Man[] }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: paper, margin: 0, fontFamily: serif }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: card, borderTop: `3px solid ${wine}`, padding: "40px 36px" }}>
          <Text style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: wine, margin: 0 }}>
            Matchmaker · Private introductions
          </Text>
          <Heading style={{ fontFamily: serif, fontWeight: 500, fontSize: 27, lineHeight: 1.15, color: ink, margin: "18px 0 10px" }}>
            {men.length} men this week, and where you could meet them.
          </Heading>
          <Text style={{ fontSize: 16, fontStyle: "italic", color: soft, margin: 0, maxWidth: 460 }}>
            You stay invisible. Message anyone yourself and mention Matchmaker, or reply with his
            name and we make the introduction. Or do nothing, and next week comes anyway.
          </Text>
          <Hr style={{ borderColor: "rgba(36,32,27,.14)", margin: "26px 0" }} />

          {men.map((m, i) => (
            <Section key={m.id}>
              {i > 0 && <Hr style={{ borderColor: "rgba(36,32,27,.14)", margin: "22px 0" }} />}
              <table width="100%" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: serif, fontWeight: 500, fontSize: 21, color: ink }}>
                      {m.name}, {m.age} <span style={{ color: faint, fontStyle: "italic", fontSize: 17 }}>· {m.city}</span>
                    </td>
                    <td align="right" style={{ fontFamily: "monospace", fontSize: 12, color: wine, whiteSpace: "nowrap" }}>
                      {m.ig}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Text style={{ fontSize: 16, color: ink, margin: "10px 0 14px" }}>{m.description}</Text>
              <Text style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: faint, margin: "0 0 4px" }}>Open to</Text>
              <Text style={{ fontSize: 15, color: soft, margin: "0 0 14px" }}>{m.openTo}</Text>
              <Section style={{ backgroundColor: "rgba(122,46,51,.08)", borderLeft: `2px solid ${wine}`, padding: "12px 15px" }}>
                <Text style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: wine, margin: "0 0 6px" }}>Where you'll find him</Text>
                {m.places.map((p, k) => (
                  <Text key={k} style={{ fontSize: 15, color: ink, margin: "3px 0" }}>· {p}</Text>
                ))}
              </Section>
            </Section>
          ))}

          <Hr style={{ borderColor: "rgba(36,32,27,.14)", margin: "26px 0" }} />
          <Text style={{ fontSize: 13, fontStyle: "italic", color: faint, margin: 0 }}>
            Shared privately with you. Please don't forward or screenshot. You can leave any time by
            replying. — <Link href="#" style={{ color: wine }}>Matchmaker</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default Drop;
