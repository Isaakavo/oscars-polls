import { useState } from 'react';
import { Table, Button, Tag, Space, Modal, Input, List, message, Avatar } from 'antd';
import { TrophyOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useCategories } from '../../polls/hooks/useCategories';
import { searchMovies } from '../api/tmdb';
import { markWinner } from '../api/admin-actions';
import { useQueryClient } from '@tanstack/react-query';
import { addNomineeFromTMDB } from '../api/admin-actions';
import { useMutation } from '@tanstack/react-query';

export const AdminDashboard = () => {
    const { data: categories } = useCategories();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const handleSearch = async () => {
        try {
            const results = await searchMovies(searchTerm);
            setSearchResults(results);
        } catch (e) {
            message.error('Error buscando películas');
        }
    };

    const handleMarkWinner = async (nomineeId: number, categoryId: number) => {
        try {
            await markWinner(nomineeId, categoryId);
            message.success('¡Ganador actualizado!');
            queryClient.invalidateQueries({ queryKey: ['categories'] }); // Refrescar UI
        } catch (e) {
            message.error('Error al actualizar');
        }
    };

    const addMutation = useMutation({
        mutationFn: addNomineeFromTMDB,
        onSuccess: () => {
            message.success('Película agregada a la categoría');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsModalOpen(false);
        },
        onError: () => message.error('Error al agregar'),
    });

    const columns = [
        { title: 'Categoría', dataIndex: 'name', key: 'name' },
        {
            title: 'Nominados',
            key: 'nominees',
            render: (_: any, record: any) => (
                <Space wrap>
                    {record.nominees.map((nom: any) => (
                        <Tag
                            key={nom.id}
                            color={nom.is_winner ? 'gold' : 'default'}
                            style={{ cursor: 'pointer', padding: 5 }}
                            onClick={() => handleMarkWinner(nom.id, record.id)}
                        >
                            {nom.is_winner && <TrophyOutlined style={{ marginRight: 5 }} />}
                            {nom.name}
                        </Tag>
                    ))}
                    <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setSelectedCategory(record.id);
                            setIsModalOpen(true);
                        }}
                    >
                        Agregar
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: 'white', borderRadius: 8 }}>
            <h2>Panel de Administración</h2>
            <Table dataSource={categories} columns={columns} rowKey="id" pagination={false} />

            {/* Modal para buscar y agregar pelis */}
            <Modal
                title="Buscar en TMDB"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Space.Compact style={{ width: '100%', marginBottom: 20 }}>
                    <Input
                        placeholder="Ej. Barbie"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onPressEnter={handleSearch}
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>Buscar</Button>
                </Space.Compact>

                <List
                    itemLayout="horizontal"
                    dataSource={searchResults}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="primary"
                                    loading={addMutation.isPending}
                                    onClick={() => {
                                        if (selectedCategory) {
                                            addMutation.mutate({
                                                id: categories?.flatMap(cat => cat.nominees).find(nom => nom.movie_title === item.title)?.id,
                                                categoryId: selectedCategory,
                                                movie: item
                                            });
                                        }
                                    }}
                                >
                                    Agregar
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.poster_path} shape="square" size={64} />}
                                title={item.title}
                                description={item.release_date}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};