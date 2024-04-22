import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { TypographyMuted } from "@/components/TypographyMuted";

const LinkWithExternalIcon = ({ href }: { href: string }) => {
  return (
    <Link href={href} target={"_blank"}>
      <div className={"flex flex-row gap-2 items-center"}>
        <TypographyMuted className={''}>{href}</TypographyMuted>
        <ExternalLink className={"inline"} size={18} />
      </div>
    </Link>
  );
};

export default LinkWithExternalIcon;
