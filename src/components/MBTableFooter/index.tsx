import React from "react";
import { Pagination } from "react-bootstrap";
import GetListResponse from "../../models/getListResponse";

export default function index(props: Props) {
  return props.data.count > 0 ? (
    <div className="row mt-3">
      <div className="col-6 col-xl-4">
        <select
          className="form-select"
          style={{ maxWidth: "80px" }}
          value={props.pageSize}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => props.setPageSize(e.currentTarget.value)}
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="d-flex justify-content-center col-12 col-xl-4 order-3 order-xl-2">
        {props.data.pages > 1 && (
          <Pagination>
            <Pagination.First disabled={!props.data.hasPrevious} onClick={() => props.setPage(0)} />
            <Pagination.Prev disabled={!props.data.hasPrevious} onClick={() => props.setPage(props.data.index - 1)} />
            {props.data.pages > 10 && props.data.index > 3 && <Pagination.Ellipsis onClick={() => props.setPage(props.data.index - 4)} />}
            {Array.from(Array(props.data.pages).keys())
              .filter((c) => {
                if (props.data.pages > 10) return c >= props.data.index - 3 && c <= props.data.index + 3;
                return true;
              })
              .map((page) => (
                <Pagination.Item key={page} active={props.data.index === page} onClick={() => props.setPage(page)}>
                  {page + 1}
                </Pagination.Item>
              ))}
            {props.data.pages > 10 && props.data.index < props.data.pages - 4 && (
              <Pagination.Ellipsis onClick={() => props.setPage(props.data.index + 4)} />
            )}
            <Pagination.Next disabled={!props.data.hasNext} onClick={() => props.setPage(props.data.index + 1)} />
            <Pagination.Last disabled={!props.data.hasNext} onClick={() => props.setPage(props.data.pages - 1)} />
          </Pagination>
        )}
      </div>
      <div className="col-6 col-xl-4 text-end order-2 order-xl-3 mb-3">
        <small>
          Toplam {props.data.count} ögeden{" "}
          {props.data.count <= props.data.size
            ? `1-${props.data.count}`
            : props.data.index + 1 === props.data.pages
            ? `${props.data.size * props.data.index + 1}-${props.data.count}`
            : `${(props.data.index + 1) * props.data.size - props.data.size + 1}-${(props.data.index + 1) * props.data.size}`}{" "}
          arası gösteriliyor.
        </small>
      </div>
    </div>
  ) : (
    <div className="text-center">
      <span>Eşleşen öğe bulunamadı</span>
    </div>
  );
}

interface Props {
  data: GetListResponse<any>;
  setPage: Function;
  setPageSize: Function;
  pageSize: number;
}
