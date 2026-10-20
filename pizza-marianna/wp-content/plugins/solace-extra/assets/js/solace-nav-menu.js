( function ($) {
    // Helper function to set CSS with !important
    function setStyleImportant($element, property, value) {
        const element = $element[0];
        if (element && element.style) {
            element.style.setProperty(property, value, 'important');
        }
    }

    // Helper function to remove CSS property
    function removeStyleProperty($element, property) {
        const element = $element[0];
        if (element && element.style) {
            element.style.removeProperty(property);
        }
    }

    // Function to bind hover event for menu items with children (min 1024px)
    function solaceExtraBindHoverActive() {
        // Check if window width is at least 1024px
        function isMinWidth1024() {
            return $(window).width() >= 1024;
        }

        // Remove any previously attached event handlers to avoid duplicates
        $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal li.menu-item-has-children, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical li.menu-item-has-children').off('mouseenter.hoverActive mouseleave.hoverActive');
        $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal ul.sub-menu, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical ul.sub-menu').off('mouseenter.subMenuHover mouseleave.subMenuHover');

        // Only bind if window width is at least 1024px
        if (isMinWidth1024()) {
            // Hover event for li.menu-item-has-children
            $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal li.menu-item-has-children, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical li.menu-item-has-children').on('mouseenter.hoverActive', function() {
                const $menuItem = $(this);
                const $subMenu = $menuItem.find('ul.sub-menu').first();
                
                // Close all submenus of other menu items that are currently open.
                $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal li.menu-item-has-children, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical li.menu-item-has-children').not($menuItem).each(function() {
                    const $otherMenuItem = $(this);
                    const $otherSubMenu = $otherMenuItem.find('ul.sub-menu').first();
                    
                    // Clear timeout from other menu items
                    if ($otherMenuItem.data('hover-timeout')) {
                        clearTimeout($otherMenuItem.data('hover-timeout'));
                        $otherMenuItem.removeData('hover-timeout');
                    }
                    
                    // Reset flags and close the submenu.
                    $otherMenuItem.data('li-hovering', false);
                    $otherSubMenu.data('submenu-hovering', false);
                    removeStyleProperty($otherSubMenu, 'display');
                });
                
                // Clear any existing timeout
                if ($menuItem.data('hover-timeout')) {
                    clearTimeout($menuItem.data('hover-timeout'));
                    $menuItem.removeData('hover-timeout');
                }

                // If a sub-menu is being hovered, do nothing.
                if ($subMenu.data('submenu-hovering')) {
                    return;
                }

                // Add display block !important to the sub-menu.
                setStyleImportant($subMenu, 'display', 'block');
                $menuItem.data('li-hovering', true);
            });

            // Mouse leave event for li.menu-item-has-children
            $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal li.menu-item-has-children, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical li.menu-item-has-children').on('mouseleave.hoverActive', function() {
                const $menuItem = $(this);
                const $subMenu = $menuItem.find('ul.sub-menu').first();
                
                // Clear any existing timeout
                if ($menuItem.data('hover-timeout')) {
                    clearTimeout($menuItem.data('hover-timeout'));
                }

                // If the sub-menu is being hovered, do not remove display block.
                if ($subMenu.data('submenu-hovering')) {
                    $menuItem.data('li-hovering', false);
                    return;
                }

                // Set the flag that the li is no longer hovered.
                $menuItem.data('li-hovering', false);

                // Hold for 200 milliseconds before removing display block.
                const timeoutId = setTimeout(function() {
                    // Check again whether the sub-menu is being hovered.
                    if (!$subMenu.data('submenu-hovering') && !$menuItem.data('li-hovering')) {
                        removeStyleProperty($subMenu, 'display');
                    }
                    $menuItem.removeData('hover-timeout');
                }, 200);

                // Store timeout ID in data attribute
                $menuItem.data('hover-timeout', timeoutId);
            });

            // Hover event for ul.sub-menu
            $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal ul.sub-menu, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical ul.sub-menu').on('mouseenter.subMenuHover', function() {
                const $subMenu = $(this);
                const $menuItem = $subMenu.closest('li.menu-item-has-children');
                
                // Set the flag that the sub-menu is being hovered.
                $subMenu.data('submenu-hovering', true);
                
                // Clear the timeout from li if any
                if ($menuItem.data('hover-timeout')) {
                    clearTimeout($menuItem.data('hover-timeout'));
                    $menuItem.removeData('hover-timeout');
                }

                // Ensure display block stays in place.
                setStyleImportant($subMenu, 'display', 'block');
            });

            // Mouse leave event for ul.sub-menu
            $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal ul.sub-menu, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical ul.sub-menu').on('mouseleave.subMenuHover', function() {
                const $subMenu = $(this);
                const $menuItem = $subMenu.closest('li.menu-item-has-children');
                
                // Set the flag that the sub-menu is no longer hovered.
                $subMenu.data('submenu-hovering', false);

                // If the li is also not hovered, remove display block after 200 milliseconds.
                if (!$menuItem.data('li-hovering')) {
                    const timeoutId = setTimeout(function() {
                        // Check again whether the sub-menu or li is being hovered.
                        if (!$subMenu.data('submenu-hovering') && !$menuItem.data('li-hovering')) {
                            removeStyleProperty($subMenu, 'display');
                        }
                        $menuItem.removeData('hover-timeout');
                    }, 200);
                    
                    $menuItem.data('hover-timeout', timeoutId);
                }
            });
        } else {
            // If the resolution is below 1024px, remove all added inline styles.
            $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-horizontal ul.sub-menu, .elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical ul.sub-menu').each(function() {
                const $subMenu = $(this);
                removeStyleProperty($subMenu, 'display');
            });
        }
    }

    // Function to bind the click event for the menu toggle
    function solaceExtraBindSolaceMenuToggle() {
        $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical .menu-item-has-children').on('mouseenter', function() {
            var $menuItem = $(this);
            var $extraLink = $menuItem.find('a.extra-link').first();
            const $subMenu = $menuItem.find('.sub-menu').first();
            var extraLinkWidth = $extraLink.outerWidth();
        
            $menuItem.find('.sub-menu').css('left', extraLinkWidth + 'px');

            $('.elementor-widget-solace-extra-nav-menu .elementor-nav-menu--layout-vertical .menu-item-has-children .sub-menu').removeClass('active');

            // Add 'active' class, then remove it after 200 milliseconds
            $subMenu.addClass('active');

            setTimeout(() => {
                $subMenu.removeClass('active');
            }, 200);            
        });

        // Remove any previously attached event handlers to avoid duplicates
        $('.solace-elementor-menu-toggle').off('click').on('click', function() {
            const $toggle = $(this);
            const isCurrentlyActive = $toggle.hasClass('elementor-active');

            // Get position before toggling class
            // If not active, get current position. If active, use saved original position or get current
            let topPosition, leftPosition;
            
            if (!isCurrentlyActive) {
                // Save original position before making it fixed
                // Get position from icon (svg or i) inside the toggle
                const $icon = $toggle.find('svg, i').first();
                const iconOffset = $icon.length ? $icon.offset() : $toggle.offset();
                topPosition = iconOffset.top;
                leftPosition = iconOffset.left;
                
                // Store original position in data attribute for future use
                $toggle.data('original-top', topPosition);
                $toggle.data('original-left', leftPosition);
            } else {
                // Use saved original position if available
                topPosition = $toggle.data('original-top');
                leftPosition = $toggle.data('original-left');
            }

            // Toggle the 'elementor-active' class on click
            $toggle.toggleClass('elementor-active');
            
            // Apply top and left position when active
            if ($toggle.hasClass('elementor-active') && topPosition !== undefined && leftPosition !== undefined) {
                $toggle.css({
                    'top': topPosition - 3 + 'px',
                    'left': leftPosition - 3 + 'px'
                });
            } else {
                // Reset position when inactive
                $toggle.css({
                    'top': '',
                    'left': ''
                });
            }
            
            // Get the current 'aria-expanded' value and toggle it
            const isExpanded = $toggle.attr('aria-expanded') === 'true';
            $toggle.attr('aria-expanded', !isExpanded);

            // Set the width and position of the nav dropdown when the menu opens.
            // Find the nav dropdown inside the same widget.
            const $widget   = $toggle.closest('.elementor-widget-solace-extra-nav-menu');
            const $dropdown = $widget.find('.elementor-nav-menu--dropdown.solace-elementor-nav-menu--dropdown.elementor-nav-menu__container');

            // Add a special class for the open state (different from the active class).
            $dropdown.toggleClass('solace-dropdown-open');
            
            // Set padding-top from topPosition when the dropdown is open.
            if ($dropdown.length) {
                if ($dropdown.hasClass('solace-dropdown-open') && topPosition !== undefined) {
                    $dropdown.css({
                        'paddingTop': topPosition + 55 + 'px'
                    });
                } else {
                    // Reset padding-top when the dropdown is closed.
                    $dropdown.css({
                        'paddingTop': '115px'
                    });
                }
            }

            // Toggle display none for #wpadminbar
            const $wpAdminBar = $('#wpadminbar');
            if ($wpAdminBar.length) {
                if ($toggle.hasClass('elementor-active')) {
                    $wpAdminBar.css('display', 'none');
                } else {
                    $wpAdminBar.css('display', '');
                }
            }
        });

        // Attach a click event handler to links (<a>) that are direct children of <li> elements 
        $('.elementor-nav-menu--dropdown.solace-elementor-nav-menu--dropdown li.menu-item-has-children > a').on('click', function(e) {
            const $link = $(this);
            const $submenu = $link.siblings('.sub-menu').css({
                'display': 'block',
                'width': '100%'
            });

            // If the submenu does NOT have the 'active' class yet (first click)
            if (!$submenu.hasClass('active')) {
                e.preventDefault();
                e.stopImmediatePropagation();

                // Add 'active' class and set CSS again to make sure it's visible and full width
                $submenu.addClass('active').css({
                    'display': 'block',
                    'width': '100%'
                });
            }
        });
    }

    // Initial binding when Elementor frontend is fully initialized
    $(window).on('elementor/frontend/init', function() {
        solaceExtraBindSolaceMenuToggle();
        solaceExtraBindHoverActive();
    });

    // Use MutationObserver to monitor DOM changes and rebind events if needed
    const observer = new MutationObserver(() => {
        solaceExtraBindSolaceMenuToggle();
        solaceExtraBindHoverActive();
    });

    // Start observing the body for child list and subtree changes
    observer.observe(document.body, {
        childList: true,  // Observe direct children
        subtree: true,    // Observe all descendants
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Bind hover active on DOM ready
        solaceExtraBindHoverActive();
    });

    // Rebind hover active on window resize
    let resizeTimeout;
    $(window).on('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            solaceExtraBindHoverActive();
        }, 250); // Debounce resize event
    });
   
} )( jQuery );
