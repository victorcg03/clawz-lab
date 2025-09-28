interface Props {
  readonly children: React.ReactNode;
}
export default function PrivateLayout({ children }: Props) {
  return <>{children}</>;
}
