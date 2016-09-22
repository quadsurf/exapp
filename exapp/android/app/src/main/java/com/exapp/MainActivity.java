package com.exapp;

import com.facebook.react.ReactActivity;
import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.imagepicker.ImagePickerPackage;
import com.airbnb.android.react.maps.MapsPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "exapp";
    }
}
