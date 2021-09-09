import './Header.css';

interface HeaderProps {
  header: string;
  subHeader: string;
}

export default function Header(prop: HeaderProps) {
  return (
    <div className="container">
      <div className="header">{prop.header}</div>
      <div className="sub-header">{prop.subHeader}</div>
    </div>
  );
}
