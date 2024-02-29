type AuthLayoutProps = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={"bg-gray-100"}>
      <div
        className={
          "container mx-auto min-h-dvh bg-white p-4 flex flex-col items-center justify-center"
        }
      >
        <main className={""}>{children}</main>
      </div>
    </div>
  );
}
