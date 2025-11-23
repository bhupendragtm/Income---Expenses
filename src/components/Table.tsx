interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
  }>;
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  extraAction?: (item: T) => React.ReactNode;
  actions?: boolean;
}

export default function Table<T extends { id: string }>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  extraAction,
  actions = true,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 border-b">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-2 text-left font-semibold text-gray-700">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-2 text-center font-semibold text-gray-700">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-2 text-gray-700 border-b">
                  {col.render ? col.render((row as any)[col.key], row) : String((row as any)[col.key])}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2 text-center border-b space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  )}
                  {extraAction && extraAction(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
