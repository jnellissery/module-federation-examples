import { baseSelectors } from '../../../cypress/common/selectors';
import { Constants } from '../../../cypress/fixtures/constants';
import { BaseMethods } from "../../../cypress/common/base";

const basePage: BaseMethods = new BaseMethods()

const appsData = [
    {
        headerText: Constants.elementsText.serverSideRenderOnlyHeaderHost,
        sharedComponentText: Constants.elementsText.serverSideRenderOnlySharedComponent,
        updatedSharedComponentText: Constants.elementsText.serverSideRenderOnlyUpdatedSharedComponent,
        host: 3000
    },
    {
        headerText: Constants.elementsText.serverSideRenderOnlyHeaderRemote,
        sharedComponentText: Constants.elementsText.serverSideRenderOnlySharedComponent,
        updatedSharedComponentText: Constants.elementsText.serverSideRenderOnlyUpdatedSharedComponent,
        host: 3001
    }
]

appsData.forEach((
    property: {
        headerText: string,
        sharedComponentText: string,
        updatedSharedComponentText: string,
        host: number
    }
) => {
    describe(`Check ${property.headerText} App`, () => {
        beforeEach(() => {
            basePage.openLocalhost(property.host)
        })

        it(`Check ${property.headerText} app build and running`, () => {
            basePage.checkElementWithTextPresence({
                selector: baseSelectors.h1,
                text: property.headerText
            })
            basePage.checkElementWithTextPresence({
                selector: baseSelectors.divElement,
                text: property.sharedComponentText
            })
        })

        it('Update Shared component file', () => {
            basePage.checkElementWithTextPresence({
                selector: baseSelectors.divElement,
                text: property.sharedComponentText
            })
            basePage.writeContentToFile({
                filePath: Constants.elementsText.serverSideRenderOnlyChangeFilePath,
                content: Constants.elementsText.serverSideRenderOnlyChangeContent
            })
            basePage.reloadWindow(true)
        })

        it(`Check Shared component visibility in ${property.headerText} after updating & check it is not reverted after reload`, () => {
            basePage.writeContentToFile({
                filePath: Constants.elementsText.serverSideRenderOnlyChangeFilePath,
                content: Constants.elementsText.serverSideRenderOnlyChangeContent
            })
            if(property.host === 3000) {
                basePage.openLocalhost(3001)
                basePage.checkElementWithTextPresence({
                    selector: baseSelectors.divElement,
                    text: property.updatedSharedComponentText
                })
                basePage.reloadWindow(true)
                basePage.checkElementWithTextPresence({
                    selector: baseSelectors.divElement,
                    text: property.updatedSharedComponentText
                })
                basePage.writeContentToFile({
                    filePath: Constants.elementsText.serverSideRenderOnlyChangeFilePath,
                    content: Constants.elementsText.serverSideRenderOnlyOriginalContent
                })
                return;
            }
            basePage.openLocalhost(3000)
            basePage.checkElementWithTextPresence({
                selector: baseSelectors.divElement,
                text: property.updatedSharedComponentText
            })
            basePage.reloadWindow(true)
            basePage.checkElementWithTextPresence({
                selector: baseSelectors.divElement,
                text: property.updatedSharedComponentText
            })
            basePage.writeContentToFile({
                filePath: Constants.elementsText.serverSideRenderOnlyChangeFilePath,
                content: Constants.elementsText.serverSideRenderOnlyOriginalContent
            })
        })

        it(`Check ${property.headerText} app build and running & check shared component visibility`, () => {
            basePage.checkElementWithTextPresence({
                selector: baseSelectors.h1,
                text: property.headerText
            })
            basePage.checkElementWithTextPresence({
                selector: baseSelectors.divElement,
                text: property.sharedComponentText
            })
        })
    })
})