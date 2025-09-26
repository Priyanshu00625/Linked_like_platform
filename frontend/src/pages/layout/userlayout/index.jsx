import NavbarComponent from "../../components/navbar"
export default function Userlayout({children}) {
    return(
        <div>
          <NavbarComponent></NavbarComponent>
            {children}
        </div>
    )
}