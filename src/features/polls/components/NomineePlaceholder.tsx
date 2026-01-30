import { FileImageOutlined, UserOutlined } from '@ant-design/icons';

interface Props {
    type?: 'movie' | 'person';
    height?: number | string;
}

export const NomineePlaceholder = ({ type = 'movie', height = 320 }: Props) => {
    return (
        <div style={{
            width: '100%',
            height: height,
            backgroundColor: '#1f1f1f', // Gris oscuro elegante
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#444', // Icono sutil
            borderBottom: '1px solid #303030'
        }}>
            {type === 'person' ? (
                <UserOutlined style={{ fontSize: 64, color: '#333' }} />
            ) : (
                <FileImageOutlined style={{ fontSize: 64, color: '#333' }} />
            )}
            <span style={{ marginTop: 10, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        Sin Imagen
      </span>
        </div>
    );
};