function CharacterCard({ character }) {
  return (
    <div className="card">
      <img
        src={character.image}
        alt={character.fullName}
        className="card-image"
      />

      <div className="card-content">
        <h2>{character.fullName}</h2>
        <p><strong>Voornaam:</strong> {character.firstName || "Onbekend"}</p>
        <p><strong>Achternaam:</strong> {character.lastName || "Onbekend"}</p>
        <p><strong>Aantal elixirs:</strong> {character.elixirs?.length || 0}</p>
      </div>
    </div>
  );
}

export default CharacterCard;