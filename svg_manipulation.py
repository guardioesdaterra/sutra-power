"""
SVG Manipulation Module for SVG-MCP.

This module provides functions for manipulating SVG elements inspired by SVG.js.
It allows for selection and transformation of SVG elements using CSS-like selectors.
"""

import re
from typing import Dict, Any, List, Optional, Tuple, Union
import xml.etree.ElementTree as ET
import math

# Register SVG namespaces
ET.register_namespace("", "http://www.w3.org/2000/svg")
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

class SVGSelector:
    """Class to select SVG elements using simplified CSS-like selectors."""
    
    @staticmethod
    def _parse_selector(selector: str) -> Dict[str, str]:
        """Parse a CSS-like selector into components."""
        result = {"tag": None, "id": None, "classes": [], "attrs": {}}
        
        # Extract ID using #
        id_match = re.search(r'#([a-zA-Z0-9\-_]+)', selector)
        if id_match:
            result["id"] = id_match.group(1)
            selector = selector.replace(f"#{id_match.group(1)}", "")
        
        # Extract classes using .
        class_matches = re.findall(r'\.([a-zA-Z0-9\-_]+)', selector)
        if class_matches:
            result["classes"] = class_matches
            for cls in class_matches:
                selector = selector.replace(f".{cls}", "")
        
        # Extract attribute selectors [attr=value]
        attr_matches = re.findall(r'\[([a-zA-Z0-9\-_:]+)(?:=([^\]]+))?\]', selector)
        if attr_matches:
            for attr, value in attr_matches:
                # Strip quotes from value if present
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                result["attrs"][attr] = value
                selector = selector.replace(f"[{attr}={value}]", "")
                
        # Remaining text should be the tag name
        tag = selector.strip()
        if tag:
            result["tag"] = tag
            
        return result
    
    @staticmethod
    def select_elements(svg_code: str, selector: str) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Select SVG elements using a CSS-like selector.
        
        Args:
            svg_code: The SVG XML code
            selector: A CSS-like selector (e.g., 'circle', '#myId', '.myClass')
            
        Returns:
            Tuple containing (modified SVG code, list of selected elements info)
        """
        # Parse the selector
        selector_parts = SVGSelector._parse_selector(selector)
        
        try:
            # Parse the SVG
            root = ET.fromstring(svg_code)
            
            # SVG namespace
            ns = {"svg": "http://www.w3.org/2000/svg"}
            
            # Build XPath query based on selector parts
            xpath = ".//"
            if selector_parts["tag"]:
                xpath += f"svg:{selector_parts['tag']}"
            else:
                xpath += "*"
                
            # Add id condition if specified
            if selector_parts["id"]:
                xpath += f"[@id='{selector_parts['id']}']"
                
            # Select elements
            elements = root.findall(xpath, ns)
            
            # Further filter by classes and attributes
            filtered_elements = []
            for elem in elements:
                should_include = True
                
                # Check classes
                if selector_parts["classes"]:
                    elem_class = elem.get("class", "")
                    elem_classes = elem_class.split()
                    for cls in selector_parts["classes"]:
                        if cls not in elem_classes:
                            should_include = False
                            break
                
                # Check attributes
                for attr, value in selector_parts["attrs"].items():
                    if elem.get(attr) != value:
                        should_include = False
                        break
                
                if should_include:
                    filtered_elements.append(elem)
            
            # Prepare element info for return
            elements_info = []
            for i, elem in enumerate(filtered_elements):
                elem_id = elem.get("id", f"_selected_{i}")
                if not elem.get("id"):
                    elem.set("id", elem_id)
                
                # Store attributes
                attrs = {}
                for name, value in elem.attrib.items():
                    attrs[name] = value
                
                elements_info.append({
                    "id": elem_id,
                    "tag": elem.tag.split("}")[-1],  # Remove namespace
                    "attributes": attrs
                })
            
            # Convert back to string
            svg_code = ET.tostring(root, encoding='unicode')
            return svg_code, elements_info
            
        except Exception as e:
            # Return original SVG and empty list if parsing fails
            return svg_code, []


class SVGTransformer:
    """Class to apply transformations to SVG elements."""
    
    @staticmethod
    def apply_transform(svg_code: str, element_id: str, transform: Dict[str, Any]) -> str:
        """
        Apply transformation to an SVG element with the given ID.
        
        Args:
            svg_code: The SVG XML code
            element_id: ID of the element to transform
            transform: Dictionary of transformations to apply
            
        Returns:
            Modified SVG code
        """
        try:
            # Parse the SVG
            root = ET.fromstring(svg_code)
            
            # Find the element by ID
            element = None
            for elem in root.iter():
                if elem.get("id") == element_id:
                    element = elem
                    break
            
            if element is None:
                return svg_code  # Element not found
            
            # Get existing transform attribute
            existing_transform = element.get("transform", "")
            
            # Build new transform string
            new_transforms = []
            
            # Process each transformation type
            if "translate" in transform:
                tx = transform["translate"].get("x", 0)
                ty = transform["translate"].get("y", 0)
                new_transforms.append(f"translate({tx} {ty})")
            
            if "rotate" in transform:
                angle = transform["rotate"].get("angle", 0)
                cx = transform["rotate"].get("cx")
                cy = transform["rotate"].get("cy")
                if cx is not None and cy is not None:
                    new_transforms.append(f"rotate({angle} {cx} {cy})")
                else:
                    new_transforms.append(f"rotate({angle})")
            
            if "scale" in transform:
                sx = transform["scale"].get("x", 1)
                sy = transform["scale"].get("y", sx)  # Default to sx if sy is not provided
                new_transforms.append(f"scale({sx} {sy})")
            
            if "skew" in transform:
                skew_x = transform["skew"].get("x", 0)
                skew_y = transform["skew"].get("y", 0)
                if skew_x != 0:
                    new_transforms.append(f"skewX({skew_x})")
                if skew_y != 0:
                    new_transforms.append(f"skewY({skew_y})")
            
            if "matrix" in transform:
                matrix = transform["matrix"]
                if isinstance(matrix, list) and len(matrix) == 6:
                    new_transforms.append(f"matrix({' '.join(map(str, matrix))})")
            
            # Combine with existing transform
            if existing_transform:
                transform_value = f"{existing_transform} {' '.join(new_transforms)}"
            else:
                transform_value = ' '.join(new_transforms)
            
            # Set the transform attribute
            if transform_value:
                element.set("transform", transform_value)
            
            # Handle direct attribute changes
            direct_attrs = ["fill", "stroke", "stroke-width", "opacity", "x", "y", 
                            "cx", "cy", "r", "width", "height", "rx", "ry", "d"]
            
            for attr in direct_attrs:
                if attr in transform:
                    element.set(attr, str(transform[attr]))
            
            # Convert back to string
            return ET.tostring(root, encoding='unicode')
            
        except Exception as e:
            # Return original SVG if transformation fails
            return svg_code


def transform_svg_element(svg_code: str, selector: str, transform: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform SVG elements that match a selector.
    
    Args:
        svg_code: The SVG code to modify
        selector: CSS-like selector to identify elements
        transform: Dictionary of transformations to apply
        
    Returns:
        Dictionary containing the results
    """
    try:
        # First, select the elements
        modified_svg, selected_elements = SVGSelector.select_elements(svg_code, selector)
        
        if not selected_elements:
            return {
                "success": False,
                "error": f"No elements found matching selector: '{selector}'",
                "modified_svg": svg_code
            }
        
        # Apply transformations to each selected element
        for element in selected_elements:
            modified_svg = SVGTransformer.apply_transform(modified_svg, element["id"], transform)
        
        return {
            "success": True,
            "original_svg": svg_code,
            "modified_svg": modified_svg,
            "matched_elements": len(selected_elements),
            "elements": selected_elements
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Error transforming SVG: {str(e)}",
            "modified_svg": svg_code
        }