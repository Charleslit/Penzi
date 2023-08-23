import React from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  onClick
}) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;