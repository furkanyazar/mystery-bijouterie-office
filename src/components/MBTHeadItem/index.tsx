import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function index({ responsive = true, searchValues, setSearchValues, title, value, style }: Props) {
  return (
    <th
      style={style}
      className={responsive ? "responsive-thead-item orderable" : "orderable"}
      onClick={() =>
        setSearchValues({
          ...searchValues,
          orderBy: value,
          descending: searchValues.orderBy === value ? !searchValues.descending : searchValues.descending,
        })
      }
    >
      {title + " "}
      {searchValues.orderBy === value ? (
        searchValues.descending ? (
          <>
            <FontAwesomeIcon className="opacity-25" icon={faCaretUp} />
            <FontAwesomeIcon icon={faCaretDown} />
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCaretUp} />
            <FontAwesomeIcon className="opacity-25" icon={faCaretDown} />
          </>
        )
      ) : (
        <>
          <FontAwesomeIcon className="opacity-25" icon={faCaretUp} />
          <FontAwesomeIcon className="opacity-25" icon={faCaretDown} />
        </>
      )}
    </th>
  );
}

interface Props {
  responsive?: boolean;
  setSearchValues: Function;
  searchValues: any;
  title: string;
  value: string;
  style?: React.CSSProperties;
}
