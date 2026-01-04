export default function GameCard({ game, onClick }) {
    return (
        <div className="card" onClick={onClick} role="button" tabIndex={0}>
            <img src={game.thumb} alt={game.name} />
            <div className="cardOverlay">
                <div className="cardName">{game.name}</div>
                <div className="cardProvider">{game.provider}</div>
            </div>
        </div>
    );
}
