const BulletList = ({ title, items, className = "" }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className={`mb-8 ${className}`}>
      {" "}
      {title && <h2 className="mb-3 text-2xl font-bold">{title}</h2>}{" "}
      <ul className="list-disc space-y-2 pl-5">
        {" "}
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {" "}
            {item}{" "}
          </li>
        ))}{" "}
      </ul>{" "}
    </section>
  );
};
export default BulletList;
