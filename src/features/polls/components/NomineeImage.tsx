import {NomineePlaceholder} from "./NomineePlaceholder.tsx";
import type {NomineeCardProps} from "./NomineeCard.tsx";


export const NomineeImage = ({nominee, isSelected}: NomineeCardProps) => {
    return (
        nominee.poster_path ? (
                <img
                    alt={nominee.name}
                    src={nominee.poster_path}
                    style={{
                        height: 'auto', width: '100%', aspectRatio: '2/3',
                        opacity: isSelected || nominee.is_winner ? 1 : 0.6,
                        filter: nominee.is_winner ? 'none' : 'grayscale(20%)' // Resaltar ganador a color
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.removeAttribute('hidden');
                    }}
                />
            ) : (
                <NomineePlaceholder type={'movie'} />
            )

    )
}