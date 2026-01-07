export default function GameCard({ game, badgeText, badgeVariant, onPlay }) {
    return (
        <div className={`gameCard badge-${badgeVariant}`} role="group">
            <div className="gameCardMedia">
                <img src={game.thumb} alt={game.name} />
                {badgeText ? <div className="gameBadge">{badgeText}</div> : null}
            </div>

            <div className="gameCardBody">
                <div className="gameCardTitle">{game.name}</div>
                <div className="gameCardProvider">{game.provider}</div>

                <button
                    className="gameCardButton"
                    type="button"
                    onClick={() => onPlay(game)}
                >
                    Play Free
                </button>
            </div>
        </div>
    );
}
