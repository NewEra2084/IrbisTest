import Logo from "@/pages/general/Logo";

export default function ModalTitle({ title }) {
  return <div className={"flex items-center space-x-2"}><Logo/><span>{title}</span></div>;
}