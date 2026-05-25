import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useWorkTypes } from '../hooks/useWorkTypes';
import { useCreateWorkLog, useUpdateWorkLog } from '../hooks/useWorkLogs';
import { WorkLog } from '../types';

interface WorkLogModalProps {
  open: boolean;
  onClose: () => void;
  initialData: WorkLog | null;
}

export default function WorkLogModal({ open, onClose, initialData }: WorkLogModalProps) {
  const [form] = Form.useForm();
  const { data: workTypes = [], isLoading: isLoadingTypes } = useWorkTypes();
  const { mutate: createLog, isPending: isCreating } = useCreateWorkLog();
  const { mutate: updateLog, isPending: isUpdating } = useUpdateWorkLog();

  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          date: dayjs(initialData.date),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ date: dayjs() });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date: values.date.toISOString(),
      };

      if (isEditing) {
        updateLog({ id: initialData.id, ...payload }, { onSuccess: onClose });
      } else {
        createLog(payload, { onSuccess: onClose });
      }
    } catch {
      // Form validation error
    }
  };

  return (
    <Modal
      title={isEditing ? 'Редактировать запись' : 'Новая запись'}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={isCreating || isUpdating}
      okText="Сохранить"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item name="date" label="Дата" rules={[{ required: true, message: 'Выберите дату' }]}>
          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>

        <Form.Item
          name="workTypeId"
          label="Вид работ"
          rules={[{ required: true, message: 'Выберите вид работ' }]}
        >
          <Select
            loading={isLoadingTypes}
            placeholder="Выберите вид работ"
            options={workTypes.map((t) => ({ label: t.name, value: t.id }))}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item
            name="volume"
            label="Объём"
            rules={[
              { required: true, message: 'Укажите объём' },
              { type: 'number', min: 0.1, message: 'Минимум 0.1' },
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Ед. изм."
            rules={[{ required: true, message: 'Укажите ед. изм.' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="м³, шт, п.м." />
          </Form.Item>
        </div>

        <Form.Item
          name="workerName"
          label="ФИО исполнителя"
          rules={[{ required: true, message: 'Укажите ФИО' }]}
        >
          <Input placeholder="Иванов И.И." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
