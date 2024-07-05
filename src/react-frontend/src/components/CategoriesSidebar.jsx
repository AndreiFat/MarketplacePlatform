import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";

function CategoriesSidebar({categories}) {
    return (
        <>
            <div className={"bg-white py-3 px-4 w-25"} style={{height: "350px", overflowY: "auto"}}>
                {categories ? (
                    categories.map((category) => (
                        <div key={category.id}>
                            <Link
                                className={"p-3 sidebar-links text-decoration-none text-black d-flex align-items-center justify-content-between"}
                                to={`/productsInCategory/${category.id}`}>
                                <span>
                                    {category.name}
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </span>
                            </Link>
                        </div>
                    ))) : (<>No Categories so far</>)}
            </div>
        </>
    )
}

export default CategoriesSidebar