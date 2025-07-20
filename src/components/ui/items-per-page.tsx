import React from "react";

export interface ItemsPerPageProps {
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

const ItemsPerPage: React.FC<ItemsPerPageProps> = ({
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 15, 20, 25],
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Items per page:</span>
      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="px-2 py-1 text-sm border rounded-md bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {itemsPerPageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemsPerPage;