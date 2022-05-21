import './index.css'

const dropdownMenu = (() => {
    // returns an object with one function 'getNewDropDownMenu'

    // This varible is used for all animations
    const ANIMATION_DURATION = 400

    // Animate function
    function slideUpDown(
        element,
        upOrDown,
        slideAmount,
        duration,
        easing = 'ease-in-out',
        fill = 'forwards',
    ) {
        let direction
        if (upOrDown === 'down') direction = 'normal'
        else if (upOrDown === 'up') direction = 'reverse'
        element.animate(
            [
                { transform: 'translateY(0)' },
                { transform: `translateY(${slideAmount}px)` },
            ],
            {
                duration,
                easing,
                fill,
                direction,
            },
        )
    }

    // Animate function
    function rotate(
        element,
        startAngle,
        EndAngle,
        duration,
        direction,
        easeing = 'ease-in-out',
        fill = 'forwards',
    ) {
        element.animate(
            [
                { transform: `rotate(${startAngle}deg)` },
                { transform: `rotate(${EndAngle}deg)` },
            ],
            {
                duration,
                easeing,
                fill,
            },
        )
    }

    // Get all singlins of target element
    function getSiblings(e) {
        const siblings = []
        if (!e.target.parentElement) {
            return siblings
        }
        let sibling = e.target.parentElement.firstChild

        while (sibling) {
            if (sibling.nodeType === 1 && sibling !== e) {
                siblings.push(sibling)
            }
            sibling = sibling.nextSibling
        }
        return siblings
    }

    function toggleArrowUpDown(e) {
        const arrowImage =
            e.target.parentElement.querySelector('.dropdown-menu-img')

        if (arrowImage.classList[1] === 'arrow-down') {
            rotate(arrowImage, 0, 180, ANIMATION_DURATION)
        } else {
            rotate(arrowImage, 180, 360, ANIMATION_DURATION)
        }
        arrowImage.classList.toggle('arrow-down')
        arrowImage.classList.toggle('arrow-up')
    }

    // Drops down the menu
    function showCurrentMenu(e) {
        let { children } = e.target
        let optionCount = 0
        const placementMultiplier = 55

        toggleArrowUpDown(e)
        if (e.target.tagName.toLowerCase() === 'div') {
            children = getSiblings(e)
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const child of children) {
            if (child.tagName.toLowerCase() === 'p') {
                optionCount += 1
                if (child.classList[1] === 'hidden') {
                    child.classList.toggle('hidden')
                    child.classList.toggle('shown')
                    slideUpDown(
                        child,
                        'down',
                        placementMultiplier * optionCount,
                        ANIMATION_DURATION,
                    )
                } else if (child.classList[1] === 'shown') {
                    setTimeout(() => {
                        child.classList.toggle('shown')
                        child.classList.toggle('hidden')
                    }, ANIMATION_DURATION - 100)
                    slideUpDown(
                        child,
                        'up',
                        placementMultiplier * optionCount,
                        ANIMATION_DURATION,
                    )
                }
            }
        }
    }

    // Sets the menu value and updates displayed text, user selection is avalible as
    // the value of the value attribute i.e value="user-selection" on the mainDiv element
    function setMenuValue(e) {
        const option = e.target
        const textElement = option.parentElement.querySelector('.dropdown-text')
        textElement.textContent = option.textContent
        option.parentElement.setAttribute('value', textElement.textContent)
        textElement.classList.add('selected')
        textElement.classList.remove('unselected')
        const allOptions = option.parentElement.querySelectorAll('p.shown')
        const placementMultiplier = 55
        let oCount = 0
        toggleArrowUpDown(e)

        // eslint-disable-next-line no-restricted-syntax
        for (const o of allOptions) {
            oCount += 1
            slideUpDown(
                o,
                'up',
                oCount * placementMultiplier,
                ANIMATION_DURATION,
            )
            setTimeout(() => {
                o.classList.toggle('shown')
                o.classList.toggle('hidden')
            }, ANIMATION_DURATION - 100)
        }
    }

    // Return a new node object that can be appended to the page
    function getNewDropdown(defaultText, optionsArray) {
        const mainDiv = document.createElement('div')
        mainDiv.classList.add('dropdown-menu')

        const textDiv = document.createElement('div')
        textDiv.textContent = defaultText
        textDiv.classList.add('dropdown-text')
        textDiv.classList.add('unselected')
        textDiv.addEventListener('click', (e) => showCurrentMenu(e))

        const imgDiv = document.createElement('div')
        imgDiv.classList.add('dropdown-menu-img')
        imgDiv.classList.add('arrow-down')
        imgDiv.addEventListener('click', (e) => showCurrentMenu(e))

        mainDiv.appendChild(textDiv)
        mainDiv.appendChild(imgDiv)

        // eslint-disable-next-line no-restricted-syntax
        for (const string of optionsArray) {
            const optionElem = document.createElement('p')
            optionElem.textContent = string
            optionElem.classList.add('option')
            optionElem.classList.add('hidden')
            optionElem.addEventListener('click', (e) => setMenuValue(e))

            mainDiv.appendChild(optionElem)
        }

        return mainDiv
    }

    return {
        getNewDropdown,
    }
})()

export default dropdownMenu
