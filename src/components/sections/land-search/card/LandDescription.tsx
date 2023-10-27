import type { Land } from "../../../../model/Land";

interface Props {
  land: Land;
}

const LandDescription: React.FC<Props> = ({ land }) => {
  return (
    <a className="h-full" href={land.slug}>
      <div className="py-1.5 pl-2 pr-14 w-full h-full   relative">
        <span className="text-base md:text-lg font-semibold tracking-tight leading-tight block">
          {land.title}
        </span>
        <p className="text-xs md:text-sm font-normal not-italic opacity-80">
          {land.briefDescription || land.address}
        </p>

        <span className="block mt-0 absolute bottom-2 right-2">
          <span className="text-[--color-accent] text-sm font-medium xl:font-normal xl:text-base">
            <span className="text-base md:text-xl xl:text-2xl font-normal md:font-light tracking-tighter leading-tight">
              {(land?.price || 0) / 1000000000}
            </span>{" "}
            tỷ
          </span>
          {land?.area && (
            <span className="opacity-90 tracking-tighter text-xs">
              <span className=" bg-[--color-text] w-[1px] h-5 xl:h-5 inline-block -mb-1 ml-1 mr-1.5 opacity-20" />
              {land.area.toLocaleString().replace(/,/g, " ")} m<sup>2</sup>
            </span>
          )}
        </span>

        <div className="grid grid-cols-[auto_1fr] gap-x-1 gap-y-2 text-xs opacity-90 items-center mt-3.5 mb-10">
          {land.address && (
            <>
              <div className="w-3.5 h-3.5">
                <svg
                  className="w-full h-full"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 11L11 13L15 9M19 10.2C19 14.1764 15.5 17.4 12 21C8.5 17.4 5 14.1764 5 10.2C5 6.22355 8.13401 3 12 3C15.866 3 19 6.22355 19 10.2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="tracking-normal hidden">Địa chỉ: </span>
                <span className="font-semibold tracking-tight ">
                  {land.address}
                </span>
              </div>
            </>
          )}

          {land.area ? (
            <>
              <div className="w-3.5 h-3.5">
                <svg
                  className="w-full h-full"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V3M14.4286 10L12.8153 8.26266C12.408 7.82396 12.2043 7.6046 11.9659 7.52324C11.7565 7.45174 11.5292 7.45174 11.3198 7.52324C11.0814 7.6046 10.8778 7.82396 10.4704 8.26266L7.42753 11.5396C7.26951 11.7098 7.1905 11.7948 7.13411 11.8925C7.0841 11.979 7.04735 12.0726 7.0251 12.1701C7 12.28 7 12.3961 7 12.6283V15.4C7 15.9601 7 16.2401 7.10899 16.454C7.20487 16.6422 7.35785 16.7951 7.54601 16.891C7.75992 17 8.03995 17 8.6 17H18.4C18.9601 17 19.2401 17 19.454 16.891C19.6422 16.7951 19.7951 16.6422 19.891 16.454C20 16.2401 20 15.9601 20 15.4V12.6283C20 12.3961 20 12.28 19.9749 12.1701C19.9526 12.0726 19.9159 11.979 19.8659 11.8925C19.8095 11.7948 19.7305 11.7098 19.5725 11.5396L18.1429 10C17.9623 9.80555 17.872 9.70833 17.7812 9.6458C17.4397 9.41088 16.9888 9.41088 16.6474 9.6458C16.5566 9.70833 16.4663 9.80555 16.2857 10C16.1052 10.1944 16.0149 10.2917 15.924 10.3542C15.5826 10.5891 15.1317 10.5891 14.7903 10.3542C14.6994 10.2917 14.6091 10.1944 14.4286 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <span className="tracking-normal hidden">Diện tích: </span>
                <span className="font-semibold tracking-tight">
                  {land.area}&nbsp;m<sup>2</sup>
                </span>
              </div>
            </>
          ) : (
            ""
          )}

          {land.papers && (
            <>
              <div className="w-3.5 h-3.5">
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m7.2 21c-1.12011 0-1.68016 0-2.10798-.218-.37633-.1917-.68229-.4977-.87403-.874-.21799-.4278-.21799-.9879-.21799-2.108v-11.6c0-1.12011 0-1.68016.21799-2.10798.19174-.37633.4977-.68229.87403-.87403.42782-.21799.98788-.21799 2.10798-.21799h9.6c1.1201 0 1.6802 0 2.108.21799.3763.19174.6823.4977.874.87403.218.42782.218.98788.218 2.10798v.8m-12 0h6m-6 8h1m-1-4h4m-.8046 9.8945 1.3148-.2598c.7095-.1402 1.0642-.2103 1.395-.3395.2936-.1146.5726-.2635.8313-.4436.2914-.203.5471-.4586 1.0584-.97l5.1485-5.1484c.6872-.6873.6872-1.8016 0-2.4888-.6873-.6873-1.8016-.6873-2.4888 0l-5.2364 5.2364c-.4792.4792-.7188.7188-.9123.9904-.1718.2411-.3163.5005-.4308.7735-.129.3075-.2065.6373-.3616 1.297z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <span className="tracking-normal hidden">
                  Giấy tờ pháp lý:{" "}
                </span>
                <span className="font-semibold tracking-tight">
                  {land.papers}
                </span>
              </div>
            </>
          )}

          {land.price ? (
            <>
              <div className="w-3.5 h-3.5">
                <svg
                  className="w-full h-full"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 21H21M3 18H21M5.82333 3.00037C6.2383 3.36683 6.5 3.90285 6.5 4.5C6.5 5.60457 5.60457 6.5 4.5 6.5C3.90285 6.5 3.36683 6.2383 3.00037 5.82333M5.82333 3.00037C5.94144 3 6.06676 3 6.2 3H17.8C17.9332 3 18.0586 3 18.1767 3.00037M5.82333 3.00037C4.94852 3.00308 4.46895 3.02593 4.09202 3.21799C3.71569 3.40973 3.40973 3.71569 3.21799 4.09202C3.02593 4.46895 3.00308 4.94852 3.00037 5.82333M3.00037 5.82333C3 5.94144 3 6.06676 3 6.2V11.8C3 11.9332 3 12.0586 3.00037 12.1767M3.00037 12.1767C3.36683 11.7617 3.90285 11.5 4.5 11.5C5.60457 11.5 6.5 12.3954 6.5 13.5C6.5 14.0971 6.2383 14.6332 5.82333 14.9996M3.00037 12.1767C3.00308 13.0515 3.02593 13.531 3.21799 13.908C3.40973 14.2843 3.71569 14.5903 4.09202 14.782C4.46895 14.9741 4.94852 14.9969 5.82333 14.9996M5.82333 14.9996C5.94144 15 6.06676 15 6.2 15H17.8C17.9332 15 18.0586 15 18.1767 14.9996M21 12.1771C20.6335 11.7619 20.0973 11.5 19.5 11.5C18.3954 11.5 17.5 12.3954 17.5 13.5C17.5 14.0971 17.7617 14.6332 18.1767 14.9996M21 12.1771C21.0004 12.0589 21 11.9334 21 11.8V6.2C21 6.06676 21 5.94144 20.9996 5.82333M21 12.1771C20.9973 13.0516 20.974 13.5311 20.782 13.908C20.5903 14.2843 20.2843 14.5903 19.908 14.782C19.5311 14.9741 19.0515 14.9969 18.1767 14.9996M20.9996 5.82333C20.6332 6.2383 20.0971 6.5 19.5 6.5C18.3954 6.5 17.5 5.60457 17.5 4.5C17.5 3.90285 17.7617 3.36683 18.1767 3.00037M20.9996 5.82333C20.9969 4.94852 20.9741 4.46895 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.5311 3.02593 19.0515 3.00308 18.1767 3.00037M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="">
                <span className="tracking-normal hidden">Giá: </span>
                <span className="font-semibold tracking-tight  ">
                  {(land?.price || 0) / 1000000000}&nbsp;tỷ đồng{" "}
                  {land.area && (
                    <span className="font-normal tracking-tight">
                      ({(land.price / 1000000 / land.area).toFixed(1)}&nbsp;
                      triều/m<sup>2</sup>)
                    </span>
                  )}
                </span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </a>
  );
};

export default LandDescription;
