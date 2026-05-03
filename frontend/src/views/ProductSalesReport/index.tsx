import { useState, useEffect, useRef } from "react";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faFileExport,
    faInbox,
    faTrophy,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import {
    getProductSalesReport,
    IProductSalesReportItem,
    IProductSalesReportFilters
} from "../../services/reportService";
import { DateRangePicker } from "../../components/DateRangePicker";
import { ReportCategoryMenu } from "../../components/ReportCategoryMenu";
import placeholderImage from "../../assets/images/placeholder_products.png";
import {
    Container,
    Header,
    ExportButton,
    TableSection,
    TableHeader,
    TableTitle,
    TableContent,
    EmptyState,
    LoadingContainer,
    ProductImage,
    SearchContainer,
    SearchInput,
    PaginationContainer,
    PaginationButton,
    PageInfo
} from "./style";

moment.locale('pt-br');

export function ProductSalesReport() {
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<string | null>(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState<string | null>(moment().format('YYYY-MM-DD'));
    const [productName, setProductName] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsData, setProductsData] = useState<IProductSalesReportItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const reportRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, productName, currentPage, selectedCategoryId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const filters: IProductSalesReportFilters = {
                page: currentPage,
                pageSize: 20,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                product_name: productName || undefined,
                category_id: selectedCategoryId || undefined
            };

            const response = await getProductSalesReport(filters);
            setProductsData(response.data.data);
            setTotalPages(response.data.totalPages);
            setTotalProducts(response.data.total);
        } catch (error) {
            console.error("Error fetching product sales report:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (start: string | null, end: string | null, filterType: string) => {
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setProductName(value);
            setCurrentPage(1);
        }, 500);
    };

    const handleCategoryChange = (categoryId: string | undefined) => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(1);
    };

    const handleExportPDF = async () => {
        try {
            if (!reportRef.current) return;
            
            const { jsPDF } = await import('jspdf');
            const html2canvas = (await import('html2canvas')).default;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.setFontSize(20);
            pdf.setTextColor(59, 130, 246);
            pdf.text('Relatório - Sistema MF', pageWidth / 2, 15, { align: 'center' });

            pdf.setFontSize(12);
            pdf.setTextColor(107, 114, 128);
            pdf.text('Produtos Vendidos', pageWidth / 2, 22, { align: 'center' });
            
            if (startDate && endDate) {
                pdf.text(
                    `Período: ${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`,
                    pageWidth / 2,
                    29,
                    { align: 'center' }
                );
            } else {
                pdf.text('Período: Todos os registros', pageWidth / 2, 29, { align: 'center' });
            }

            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 35;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - position);

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 35;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const totalPages = pdf.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(156, 163, 175);
                pdf.text(
                    `Página ${i} de ${totalPages} - Gerado em ${moment().format('DD/MM/YYYY HH:mm')}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            pdf.save(`relatorio-produtos-vendidos-${moment().format('YYYY-MM-DD')}.pdf`);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Erro ao exportar PDF. Tente novamente.');
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getDateRangeText = () => {
        if (startDate && endDate) {
            if (startDate === endDate) {
                return moment(startDate).format('DD/MM/YYYY');
            }
            return `${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`;
        }
        return 'Todos os períodos';
    };

    const renderContent = () => {
        if (loading) {
            return (
                <LoadingContainer>
                    <div className="spinner"></div>
                    <p>Carregando relatório...</p>
                </LoadingContainer>
            );
        }

        if (productsData.length === 0) {
            return (
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Não há produtos vendidos no período selecionado</p>
                </EmptyState>
            );
        }

        return (
            <div ref={reportRef}>
                <TableSection>
                    <TableHeader>
                        <TableTitle>
                            <h2>
                                <FontAwesomeIcon icon={faTrophy} />
                                Produtos Vendidos
                            </h2>
                            <p className="subtitle">
                                {totalProducts} {totalProducts === 1 ? 'produto encontrado' : 'produtos encontrados'} - {getDateRangeText()}
                            </p>
                        </TableTitle>
                    </TableHeader>
                    <TableContent>
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>Imagem</th>
                                    <th>Produto</th>
                                    <th>Quantidade Vendida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsData.map((product) => (
                                    <tr key={product.id}>
                                        <td data-label="Imagem">
                                            <ProductImage 
                                                src={product.image || placeholderImage} 
                                                alt={product.name} 
                                            />
                                        </td>
                                        <td className="name" data-label="Produto">{product.name}</td>
                                        <td className="number" data-label="Quantidade">{product.quantity_sold} un</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContent>
                </TableSection>

                {totalPages > 1 && (
                    <PaginationContainer>
                        <PaginationButton
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </PaginationButton>
                        <PageInfo>
                            Página {currentPage} de {totalPages}
                        </PageInfo>
                        <PaginationButton
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Próxima
                        </PaginationButton>
                    </PaginationContainer>
                )}
            </div>
        );
    };

    return (
        <Container>
            <Header>
                <h1>
                    <FontAwesomeIcon icon={faChartLine} />
                    Relatório de Produtos Vendidos
                </h1>
                <p>Visualize os produtos mais vendidos com filtros personalizados</p>
                <div className="header-actions">
                    <DateRangePicker onDateRangeChange={handleDateRangeChange} defaultFilter="today" />
                    <SearchContainer>
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <SearchInput
                            type="text"
                            placeholder="Buscar produto..."
                            value={searchValue}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </SearchContainer>
                    <ExportButton onClick={handleExportPDF} disabled={loading || productsData.length === 0}>
                        <FontAwesomeIcon icon={faFileExport} />
                        Exportar PDF
                    </ExportButton>
                </div>
            </Header>

            <ReportCategoryMenu
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
            />

            {renderContent()}
        </Container>
    );
}
