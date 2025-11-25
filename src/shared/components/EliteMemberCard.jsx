import "./EliteMemberCard.css";

// Definiamo il percorso base.
// Se usi GitHub Pages con la repo "PokeMMO-Compendium", mantieni il prefisso.
// Se sei solo in locale, puoi usare semplicemente "/trainers/"
const TRAINER_PATH = "/PokeMMO-Compendium/trainers/";

const EliteMemberCard = ({
  member,
  onMemberClick,
  isSelected,
  background,
  shadowColor,
}) => {
  return (
    <div
      className={`card ${isSelected ? "selected" : ""}`}
      onClick={() => onMemberClick(member)}
      style={isSelected ? { boxShadow: shadowColor } : {}}
    >
      <p className="elite4-name" style={{ background: background }}>
        {member.name}
      </p>

      <img
        // MODIFICA QUI: Concateniamo il percorso cartella + nome file dal JSON
        src={`${TRAINER_PATH}${member.image}`}
        alt={member.name}
        className="image"
        onError={(e) => {
          // Gestione errore: se non trova l'immagine, mostra un placeholder
          e.target.onerror = null;
          e.target.src = `https://placehold.co/180x120/cccccc/333333?text=${member.name.replace(
            " ",
            "+"
          )}`;
        }}
      />
    </div>
  );
};

export default EliteMemberCard;