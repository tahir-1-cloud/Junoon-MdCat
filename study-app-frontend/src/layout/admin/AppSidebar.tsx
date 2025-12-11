"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../context/SidebarContext";
import {CalendarDaysIcon, ChevronDownIcon, DocumentTextIcon, Squares2X2Icon, UserIcon, ClipboardIcon} from '@heroicons/react/24/solid';
import {FiMoreHorizontal, FiPieChart} from 'react-icons/fi';

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
 
    {
        icon: <UserIcon className="w-5 h-5" />,
        name: "Admin Dashboard",
        path: "/admin/dashboard",
    },
    {
        icon: <Squares2X2Icon className="w-5 h-5"  />,
        name: "Students",
        subItems: [
            { name: "Add Student", path: "/admin/student/addStudent", pro: false },
            { name: "Listing", path: "/admin/student/listing", pro: false }],
    },
    {
        icon: <Squares2X2Icon className="w-5 h-5"/>,
        name: "Session",
        subItems: [
            {
                name: "Add Session", path: "/admin/session/add", pro: false
            },
            {
                name: "Listing", path: "/admin/session/listing", pro: false
            }],
    },
    {
        icon: <ClipboardIcon className="w-5 h-5"/>,
        name: "Paper",
        subItems: [
            {
                name: "Add Paper", path: "/admin/paper/add", pro: false
            },
            {
                name: "Listing", path: "/admin/paper/listing", pro: false
            }],
    },
     {
        icon: <ClipboardIcon className="w-5 h-5"/>,
        name: "Mock Paper",
        subItems: [
            {
                name: "Add Mock_Paper", path: "/admin/mocktest/add", pro: false
            },
            {
                name: "Listing", path: "/admin/mocktest/listing", pro: false
            },
            {
                name: "MockResult", path: "/admin/mocktest/mocktestresult", pro: false
            }
        ],
            
    },

      {
            icon: <ClipboardIcon className="w-5 h-5"/>,
            name: "Public Lectures",
            subItems: [
                {
                    name: "Add Lectures", path: "/admin/lectures/add", pro: false
                },
                   {
                    name: "Lectures info", path: "/admin/lectures/list", pro: false
                },
     ],
    },
   
    
      {
            icon: <ClipboardIcon className="w-5 h-5"/>,
            name: "User Engagement",
            subItems: [
                 {
                    name: "Pending Students", path: "/admin/userEngagement/pendingapplicant", pro: false
                },
                {
                    name: "Contact Requests", path: "/admin/userEngagement/contactlist", pro: false
                },
                 {
                    name: "Subscribers", path: "/admin/userEngagement/subscribelist", pro: false
                },
     ],
    },
    
];

const othersItems: NavItem[] = [
    // {
    //     icon: <FiPieChart />,
    //     name: "Charts",
    //     subItems: [
    //         { name: "Line Chart", path: "/line-chart", pro: false },
    //         { name: "Bar Chart", path: "/bar-chart", pro: false },
    //     ],
    // },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();

    const renderMenuItems = (
        navItems: NavItem[],
        menuType: "main" | "others"
    ) => (
        <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group  ${
                                openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? "menu-item-active"
                                    : "menu-item-inactive"
                            } cursor-pointer ${
                                !isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "lg:justify-start"
                            }`}
                        >
              <span
                  className={` ${
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className={`menu-item-text`}>{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                                        openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                            ? "rotate-180 text-brand-500"
                                            : ""
                                    }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                href={nav.path}
                                className={`menu-item group ${
                                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                }`}
                            >
                <span
                    className={`${
                        isActive(nav.path)
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className={`menu-item-text`}>{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : "0px",
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            href={subItem.path}
                                            className={`menu-dropdown-item ${
                                                isActive(subItem.path)
                                                    ? "menu-dropdown-item-active"
                                                    : "menu-dropdown-item-inactive"
                                            }`}
                                        >
                                            {subItem.name}
                                            <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                            <span
                                className={`ml-auto ${
                                    isActive(subItem.path)
                                        ? "menu-dropdown-badge-active"
                                        : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge `}
                            >
                            new
                          </span>
                        )}
                                                {subItem.pro && (
                                                    <span
                                                        className={`ml-auto ${
                                                            isActive(subItem.path)
                                                                ? "menu-dropdown-badge-active"
                                                                : "menu-dropdown-badge-inactive"
                                                        } menu-dropdown-badge `}
                                                    >
                            pro
                          </span>
                                                )}
                      </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {}
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // const isActive = (path: string) => path === pathname;
    const isActive = useCallback((path: string) => path === pathname, [pathname]);

    useEffect(() => {
        // Check if the current path matches any submenu item
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as "main" | "others",
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        // If no submenu item matches, close the open submenu
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [pathname,isActive]);

    useEffect(() => {
        // Set the height of the submenu items when the submenu is opened
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
                isExpanded || isMobileOpen
                    ? "w-[290px]"
                    : isHovered
                        ? "w-[290px]"
                        : "w-[90px]"
            }
                        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                        lg:translate-x-0`}
                            onMouseEnter={() => !isExpanded && setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                    <div
                        className={`py-4 flex ${
                            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                        }`}
                        >
                        <Link href="/admin/dashboard">
                            {isExpanded || isHovered || isMobileOpen ? (
                            <Image
                                src="/images/logo/mdloginclr.png"
                                alt="Logo"
                                width={130}
                                height={40}
                                className="object-contain"
                            />
                            ) : (
                            <Image
                                src="/images/logo/mdloginclr.png"
                                alt="Logo"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                            )}
                        </Link>
                    </div>

            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Menu"
                                ) : (
                                    <FiMoreHorizontal />
                                )}
                            </h2>
                            {renderMenuItems(navItems, "main")}
                        </div>

                        <div className="">
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Others"
                                ) : (
                                    <FiMoreHorizontal />
                                )}
                            </h2>
                            {renderMenuItems(othersItems, "others")}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
