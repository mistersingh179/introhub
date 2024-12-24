type AuthLayoutProps = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className={"flex flex-col min-h-lvh"}>
      {children}
    </main>
  );
}
