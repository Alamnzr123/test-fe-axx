import React from "react";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";


interface inputElement {
  value: string;
}

export default function Home() {
  const inputName = React.useRef<inputElement>({
    value: ""
  });
  const [search, setSearch] = React.useState("");
  const [maxData, setMaxData] = React.useState(0);
  const [getName, setGetName] = React.useState([]);
  const [detail, setDetail] = React.useState([]);
  const [ind, setIdn] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    let localRef = null;
    if (inputName.current) localRef = inputName.current;
    return () => {
      console.log('component unmounting', localRef); // localRef works here!
    }
  }, [])


  const onSearch = async () => {
    try {
      setLoading(true);
      const thisName = inputName.current.value;
      const response = await axios.get(
        `https://api.github.com/search/users?q=${thisName}`
      );
      const sliceData = response.data.items.slice(0, 5);
      setMaxData(sliceData.length);
      setGetName(sliceData);
      setSearch(thisName);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  const onRepo = async (name: string, index: React.SetStateAction<number>) => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${name}/repos`
      );
      setDetail(response.data);
      setIdn(index);
      setOpen(!open);
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="h-screen">
        <div className="flex flex-col justify-center items-center p-5">
          <div className="">
            <div className="mt-10 flex flex-col">
              <input
                ref={inputName}
                type="text"
                placeholder="Enter username"
                className="w-[500px] text-black rounded-md"
              />
              <button
                onClick={() => {
                  onSearch();
                }}
                className="border mt-5 py-2 bg-sky-600 rounded-md font-semibold"
              >
                Search
              </button>
            </div>
            {search ? (
              <div className="flex justify-center mt-3 text-slate-600">
                Showing {maxData} users for "{search}"
              </div>
            ) : null}
          </div>
          {loading == true ? (
            <>
              <Button>
                <Spinner aria-label="Spinner button example" size="sm" />
                <span className="pl-3">Loading...</span>
              </Button>
            </>
          ) : (
            <div className="mt-5 flex flex-col gap-1">
              {getName.map((value: string, index) => {
                return (
                  <div key={index} className="">
                    <button
                      onClick={() => {
                        onRepo(value.login, index);
                      }}
                      className="border w-[500px] rounded-md py-2"
                    >
                      <div className="flex justify-between p-5">
                        <div className="font-bold">{value.login}</div>
                        <div>
                          <IoChevronDownOutline
                            className={`${open === true && index === ind ? "rotate-180" : ""
                              }`}
                          />
                        </div>
                      </div>
                    </button>
                    {open === true && index === ind
                      ? detail.map((val: string, idx) => {
                        return (
                          <div className="border w-[500px] mt-2" key={idx}>
                            <button className="flex justify-between gap-3 w-full bg-slate-400">
                              <div className="flex flex-col gap-2 p-3">
                                <div className="flex gap-2">
                                  <div className="font-bold">{val.name}</div>
                                </div>
                                {val.description ? (
                                  <div className="flex justify-start font-medium text-justify">
                                    {val.description}
                                  </div>
                                ) : (
                                  <div className="flex justify-start font-medium">
                                    No Description
                                  </div>
                                )}
                              </div>
                              <div className="flex mt-3 justify-end p-3">
                                {val.stargazers_count}{" "}
                                <IoIosStarOutline size={25} />
                              </div>
                            </button>
                          </div>
                        );
                      })
                      : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
