import { getTranslations } from "next-intl/server"


export default async function About(){

    const t= await getTranslations("AboutPage")
    return(
        <div>
            <h1>{t("title")}</h1>
            <h1>{t("content")}</h1>
        </div>
    )
}