import Countdown from 'react-countdown';

const OSCAR_DATE = new Date('2026-03-15T17:00:00-07:00'); // Hora del Pacífico

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
        return <span style={{ color: '#d4af37', fontWeight: 'bold' }}>¡Es hoy! 🎬</span>;
    }
    return (
        <div style={{ textAlign: 'center', color: '#fff', lineHeight: 1.2 }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' }}>
                {days}d {hours}h {minutes}m {seconds}s
            </div>
            <div style={{ fontSize: 10, color: '#666' }}>FALTAN</div>
        </div>
    );
};

export const CountdownTimer = () => {
    return <Countdown date={OSCAR_DATE} renderer={renderer} />;
};