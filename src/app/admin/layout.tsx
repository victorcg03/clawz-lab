interface Props {
  readonly children: React.ReactNode;
}
export default function AdminLayout({ children }: Props) {
  return (
    <div className="p-4">
      <header className="mb-4 font-medium">Admin Panel</header>
      {children}
    </div>
  );
}
