"use client";

import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import JobFilters from "@/components/company/jobs/filter";
import List from "@/components/company/jobs/list";
import PaginationButtons from "@/components/all/pagination";
import ManageJobModal from "@/components/company/jobs/manage-modal";


export default function JobList() {
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState<"" | "11" | "12" | "13" | "14">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // modal
  const [manageId, setManageId] = useState<number | null>(null);

  // força reload da List após salvar/excluir
  const [refreshToken, setRefreshToken] = useState(0);
  const bumpRefresh = () => setRefreshToken((n) => n + 1);

  // sempre que mudar filtro, volta pra página 1
  useEffect(() => {
    setPage(1);
  }, [texto, status]);

  return (
    <Container fluid className="mt-3 p-0">
      <JobFilters
        value={{ texto, status }}
        onChange={(v) => {
          setTexto(v.texto);
          setStatus(v.status);
        }}
      />

      <List
        searchText={texto}
        status={status}
        page={page}
        pageSize={6}
        onLoaded={(meta) => setTotalPages(meta.totalPages || 1)}
        onManage={(id) => setManageId(id)}     // abre modal
        refreshToken={refreshToken}            // recarrega depois de salvar/excluir
      />

      <PaginationButtons className="mt-3" active={page} total={totalPages} onChange={setPage} />

      <ManageJobModal
        open={!!manageId}
        vagaId={manageId}
        onClose={() => setManageId(null)}
        onSaved={() => bumpRefresh()}
        onDeleted={() => {
          setManageId(null);
          bumpRefresh();
          setPage(1);
        }}
      />
    </Container>
  );
}
