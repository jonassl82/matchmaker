import {
  Html, Head, Body, Container, Heading, Text, Button,
} from "@react-email/components";
import type { Man } from "@/lib/types";

const paper = "#F4EDE1";
const card = "#FBF7EF";
const ink = "#24201B";
const soft = "#5C5347";
const wine = "#7A2E33";
const serif = "Georgia, 'Times New Roman', serif";

export function Confirm({ man, confirmUrl }: { man: Man; confirmUrl: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: paper, margin: 0, fontFamily: serif }}>
        <Container style={{ maxWidth: 520, margin: "0 auto", backgroundColor: card, borderTop: `3px solid ${wine}`, padding: "40px 36px" }}>
          <Heading style={{ fontFamily: serif, fontWeight: 500, fontSize: 24, color: ink, margin: "0 0 12px" }}>
            Still single, still in?
          </Heading>
          <Text style={{ fontSize: 16, color: soft, margin: "0 0 24px" }}>
            {man.name}, a quick check so we only introduce you when it's right. One tap keeps you in
            the weekly letter. Do nothing and you'll simply pause until you're back.
          </Text>
          <Button href={confirmUrl} style={{ backgroundColor: wine, color: paper, fontFamily: "monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", padding: "13px 22px", borderRadius: 6, textDecoration: "none" }}>
            Yes, keep me in
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

export default Confirm;
