"use client";

import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import JobFilters from "@/components/company/jobs/filter";
import List from "@/components/company/jobs/list";
import PaginationButtons from "@/components/all/pagination";

export default function JobList() {
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState<"" | "11" | "12" | "13" | "14">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // sempre que mudar filtro, volta pra página 1
  useEffect(() => { setPage(1); }, [texto, status]);

  return (
    <Container fluid className="mt-3 p-0">
      <JobFilters
        value={{ texto, status }}
        onChange={(v) => { setTexto(v.texto); setStatus(v.status); }}
      />

      <List
        searchText={texto}
        status={status}
        page={page}
        pageSize={6}
        onLoaded={(meta) => setTotalPages(meta.totalPages || 1)}
      />

      <PaginationButtons
        className="mt-3"
        active={page}
        total={totalPages}
        onChange={setPage}
      />
    </Container>
  );
}
