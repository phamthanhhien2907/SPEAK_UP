import { features } from "@/lib/helper";

const ListCardExplore = () => {
  return (
    <div>
      <div className="flex flex-col items-center flex-1">
        <h6>Công cụ & tính năng</h6>
        {features?.map((feature, index) => (
          <div key={index}>
            <img src={feature?.icon} alt={feature?.icon} />
            <div>
              <span>{feature?.title}</span>
              <span>{feature?.description}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center flex-1"></div>
    </div>
  );
};

export default ListCardExplore;
