export const PrefetchLinks = ({ links }: { links: string[] }) => (
  <>
    {links.map((link) => {
      return (
        <link key={`prefetch-${link}`} rel="prefetch" as="image" href={link} />
      );
    })}
  </>
);
