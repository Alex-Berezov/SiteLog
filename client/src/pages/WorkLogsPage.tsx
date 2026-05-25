import { useState } from 'react';
import { Button, DatePicker, Table, Space, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import { useWorkLogs, useDeleteWorkLog } from '../hooks/useWorkLogs';
import type { WorkLog } from '../types';
import WorkLogModal from '../components/WorkLogModal';

const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function WorkLogsPage() {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<WorkLog | null>(null);

  const { data: logs = [], isLoading } = useWorkLogs({
    dateFrom: dateRange?.[0],
    dateTo: dateRange?.[1],
  });

  const { mutate: deleteLog } = useDeleteWorkLog();

  const handleEdit = (record: WorkLog) => {
    setEditingLog(record);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingLog(null);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<WorkLog> = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: 'Вид работ',
      dataIndex: ['workType', 'name'],
      key: 'workType',
    },
    {
      title: 'Объём',
      key: 'volume',
      render: (_, record) => `${record.volume} ${record.unit}`,
    },
    {
      title: 'Исполнитель',
      dataIndex: 'workerName',
      key: 'workerName',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Удалить запись?"
            onConfirm={() => deleteLog(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Записи журнала
        </Title>
        <Space>
          <RangePicker
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0].toISOString(), dates[1].toISOString()]);
              } else {
                setDateRange(null);
              }
            }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Добавить
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={isLoading}
        pagination={{ defaultPageSize: 10 }}
      />

      <WorkLogModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingLog}
      />
    </div>
  );
}
