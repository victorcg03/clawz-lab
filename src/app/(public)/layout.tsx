interface Props {
  readonly children: React.ReactNode;
}
export default function PublicLayout({ children }: Props) {
  return <>{children}</>;
}
