const TipsSection = ({ title, items }) => (
  <section className="mb-8">
    <h2 className="mb-2 text-2xl font-bold text-slate-200">{title}</h2>
    <ul className="list-disc pl-5 text-slate-300">
      {items.map((item, index) => (
        <li key={index} className="mb-1">
          {item}
        </li>
      ))}
    </ul>
  </section>
);

export default TipsSection;
